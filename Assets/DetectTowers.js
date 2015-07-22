#pragma strict

private var moving : boolean = true;
private var attacking : boolean = false;

private var target : GameObject;

function OnTriggerStay(col : Collider)
{
	if(moving)
	{
		if(col.gameObject.tag == "NPC")
		{
			transform.LookAt(col.gameObject.transform);
			gameObject.transform.parent.GetComponent("AI").SendMessage("attackNPC", col.gameObject);
			moving = false;
			attacking = true;
		}
		else if(col.gameObject.tag == "Tower")
		{
			transform.LookAt(col.gameObject.transform);
			gameObject.transform.parent.GetComponent("AI").SendMessage("Attack", col.gameObject);
			moving = false;
			attacking = true;
		}
	}
}

function ObjectDead()
{
	moving = true;
	attacking = false;
}