public class AI extends Pathfinder
{
	public var moving : boolean = false;
	public var attacking : boolean = false;

	private var targetIsNPC : boolean = false;

	private var coolDown : float = 1.0;
	private var timer : float = 0.0;
	//private var target : GameObject = null;
	//private var waypoint : GameObject;
	private var currentPoint : int = 0;

	public var damageNumbers: GameObject;

	//private var speed : int = 5;

	//public var damage : int = 10;

	function Start () 
	{
		health = 100;
		GetComponent.<Animation>()["run"].speed = 2;
	}

	/*
	function Update () 
	{
		if(moving)
		{
			GetComponent.<Animation>().Play("run");
			
			transform.position = Vector3.MoveTowards(transform.position, Vector3(waypoint.transform.position.x, transform.position.y, waypoint.transform.position.z), speed * Time.deltaTime);
		}
		else if(attacking)
		{
			if(target != null)
			{
				if(Vector3.Distance(transform.position, target.transform.position) < 1)
				{
					timer += Time.deltaTime;
					if(timer >= coolDown)
					{
						GetComponent.<Animation>().Stop();
						gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
						GetComponent.<Animation>().Play("BigAttack");
						doDamage();
						timer = 0.0;
					}
				}
				else
				{
					loseTarget();
				}
			}
			else
			{
				loseTarget();
			}
		}
	}

	function loseTarget()
	{
		moving = true;
		attacking = false;
		gameObject.GetComponentInChildren(DetectTowers).SendMessage("ObjectDead");
		gameObject.transform.LookAt(waypoint.transform);
	}

	function Attack (theTarget : GameObject)
	{
		target = theTarget;
		attacking = true;
		moving = false;
		targetIsNPC = false;
	}
*/
	function attackNPC(theTarget : GameObject)
	{
		target = theTarget;
		attacking = true;
		moving = false;
		targetIsNPC = true;
	}

	function doDamage()
	{
		var dmg_packet : List.<Object> = new List.<Object>();
		dmg_packet.Add(damage);
		dmg_packet.Add(gameObject);
		if(targetIsNPC)
		{
			target.GetComponent(NPC).SendMessage("takeDamage", dmg_packet);
		}
		else
		{
			target.GetComponent(Tower).SendMessage("takeDamage", dmg_packet);
		}
	}

	/*
	function takeDamage(dmg_packet : List.<Object>)
	{
		super.takeDamage(dmg_packet);
		var attacker : GameObject = dmg_packet[1];
		var damage : int = dmg_packet[0];
		displayDamage(damage);
		if(attacker != null)
		{
			attacker.GetComponent(Tower).increaseDamageDealt(Mathf.Min(damage, health));
		}
		health -= damage;
		if(health <= 0)
		{
			Level.KILLED++;
			if(attacker != null)
			{
				attacker.GetComponent(Tower).increaseKills();
			}
			Destroy(gameObject);
		}
	}
	*/
	
	function drainDamage(percent : float, attacker : GameObject)
	{
		var damage : int = health * percent;
		attacker.GetComponent("Statistics").increaseDamageDealt(damage);
		health -= damage;
		Display_Damage(damage);
	}

	function Set_Burn(attacker : GameObject)
	{
		burnTower = attacker;
		burning = true;
	}
	
	function Set_Burn_Test()
	{
		super.Set_Burn();
	}

	/*
	function waypointReached(nextWaypoint : GameObject)
	{
		waypoint = nextWaypoint;
		gameObject.transform.LookAt(waypoint.transform);
		moving = true;
		gameObject.GetComponentInChildren(DetectTowers).SendMessage("ObjectDead");
	}
	*/
	/*
	function displayDamage(amount : int)
	{
		var damageNumber : GameObject = Instantiate(damageNumbers,gameObject.transform.position,Quaternion.identity);
		damageNumber.GetComponent.<GUIText>().text = amount.ToString();
		damageNumber.GetComponent("DamageNumber").linkObject(transform.position);
	}
	*/
	
	//OVERWRITTEN FROM DESTRUCTABLE
	function Burn_Death()
	{
		Level.KILLED++;
		if(burn_object != null)
		{
			burn_object.GetComponent(Tower).increaseKills();
			burn_object.GetComponent(Tower).increaseDamageDealt(burn_total);
		}
		Destroy(gameObject);
	}
}