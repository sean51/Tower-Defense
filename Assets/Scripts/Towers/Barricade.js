#pragma strict

public class Barricade extends Tower
{
	function Start () 
	{
		health = 100;
		max_health = 100;
	}
	
	//Overwritten from Tower
	function takeDamage(dmg_packet : List.<Object>)
	{
		var attacker : GameObject = dmg_packet[1] as GameObject;
		super.takeDamage(dmg_packet);
		if(level > 1)
		{
			var return_packet : List.<Object> = new List.<Object>();
			return_packet.Add(damage);
			return_packet.Add(gameObject);
			attacker.GetComponent("AI").SendMessage("takeDamage", return_packet);
			if(level > 2)
			{
				attacker.GetComponent.<Rigidbody>().velocity = transform.TransformDirection(Vector3.forward * 5);
			}
		}
	}
	
	//Overwritten from Tower
	function increaseLevel()
	{
		max_health += 100;
		mend(1);
		level++;
	}
}